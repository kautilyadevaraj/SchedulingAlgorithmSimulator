#include "Algorithms.h"
#include <algorithm>
#include <climits>
#include <queue>

std::vector<Process> priorityPreemptive(const std::vector<Process> &processes)
{
    std::vector<Process> result;
    std::vector<Process> sortedProcesses = processes;

    // Sort by arrival time
    std::sort(sortedProcesses.begin(), sortedProcesses.end(),
              [](const Process &a, const Process &b)
              {
                  return a.arrival_time < b.arrival_time;
              });

    // Track remaining time for each process
    std::vector<int> remainingTime(sortedProcesses.size());
    for (size_t i = 0; i < sortedProcesses.size(); i++)
    {
        remainingTime[i] = sortedProcesses[i].burst_time;
    }

    int currentTime = 0;
    int completedCount = 0;
    size_t nextArrivalIdx = 0;

    while (completedCount < sortedProcesses.size())
    {
        // Find the next available process with highest priority
        int nextProcess = -1;
        int highestPriority = INT_MAX;

        // Add newly arrived processes
        while (nextArrivalIdx < sortedProcesses.size() &&
               sortedProcesses[nextArrivalIdx].arrival_time <= currentTime)
        {
            nextArrivalIdx++;
        }

        // Find highest priority process that has arrived
        for (size_t i = 0; i < sortedProcesses.size(); i++)
        {
            if (remainingTime[i] > 0 && sortedProcesses[i].arrival_time <= currentTime)
            {
                if (sortedProcesses[i].priority < highestPriority)
                {
                    highestPriority = sortedProcesses[i].priority;
                    nextProcess = i;
                }
            }
        }

        // If no process available, jump to next arrival
        if (nextProcess == -1)
        {
            if (nextArrivalIdx < sortedProcesses.size())
            {
                int gapDuration = sortedProcesses[nextArrivalIdx].arrival_time - currentTime;
                Process gap(-1, -1, gapDuration, 0, "transparent");
                result.push_back(gap);
                currentTime = sortedProcesses[nextArrivalIdx].arrival_time;
            }
            continue;
        }

        // Execute for 1 time unit
        const Process &currentProcess = sortedProcesses[nextProcess];
        Process executing(currentProcess.process_id, currentTime, 1, currentProcess.priority, currentProcess.background);
        result.push_back(executing);

        remainingTime[nextProcess]--;
        currentTime++;

        if (remainingTime[nextProcess] == 0)
        {
            completedCount++;
        }
    }

    return result;
}
