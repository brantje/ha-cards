import type { HomeAssistant } from "custom-card-helpers";
import {
  AssistConversationFromEvents,
  AssistPipelineDebugRun,
  extractAssistConversationFromEvents,
  getAssistPipelineDebugRun,
  getAssistRunCount,
  getRecentAssistPipelineDebugRuns,
  listAssistPipelineDebugRuns,
  PipelineRunEvent,
} from "./assist-pipeline";

export type AssistRunCacheEntry = {
  events: PipelineRunEvent[];
  conversation: AssistConversationFromEvents;
  finished: boolean;
};

export class AssistRunCache {
  private entries = new Map<string, AssistRunCacheEntry>();

  get(runId: string): AssistRunCacheEntry | undefined {
    return this.entries.get(runId);
  }

  set(runId: string, entry: AssistRunCacheEntry) {
    this.entries.set(runId, entry);
  }

  prune(keepRunIds: Set<string>) {
    for (const id of this.entries.keys()) {
      if (!keepRunIds.has(id)) {
        this.entries.delete(id);
      }
    }
  }
}

export type AssistCachedRun = AssistPipelineDebugRun & {
  events: PipelineRunEvent[];
  conversation: AssistConversationFromEvents;
};

export function isAssistRunFinished(events: PipelineRunEvent[]): boolean {
  return events.some((event) => event.type === "run-end" || event.type === "error");
}

export async function fetchRecentAssistRunsWithCache(
  hass: HomeAssistant,
  pipelineId: string,
  runCount: number,
  cache: AssistRunCache,
  isRunFinishedFn: (events: PipelineRunEvent[]) => boolean = isAssistRunFinished
): Promise<AssistCachedRun[]> {
  const count = getAssistRunCount(runCount);
  if (count === 0) {
    return [];
  }

  const listResponse = await listAssistPipelineDebugRuns(hass, pipelineId);
  const recentRuns = getRecentAssistPipelineDebugRuns(listResponse.pipeline_runs || [], count);

  const runs = await Promise.all(
    recentRuns.map(async (run): Promise<AssistCachedRun> => {
      const cached = cache.get(run.pipeline_run_id);
      if (cached?.finished) {
        return { ...run, events: cached.events, conversation: cached.conversation };
      }

      const details = await getAssistPipelineDebugRun(hass, pipelineId, run.pipeline_run_id);
      const events = details.events || [];
      const conversation = extractAssistConversationFromEvents(events);
      cache.set(run.pipeline_run_id, {
        events,
        conversation,
        finished: isRunFinishedFn(events),
      });

      return { ...run, events, conversation };
    })
  );

  cache.prune(new Set(recentRuns.map((run) => run.pipeline_run_id)));
  return runs;
}
