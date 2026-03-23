#ifndef ALGORITHMS_H
#define ALGORITHMS_H

#include "Process.h"
#include <vector>

// First Come First Serve
std::vector<Process> firstComeFirstServe(const std::vector<Process>& processes);

// Round Robin
std::vector<Process> roundRobin(const std::vector<Process>& processes, int quantum);

// Shortest Job First
std::vector<Process> shortestJobFirst(const std::vector<Process>& processes);

// Shortest Remaining Time First
std::vector<Process> shortestRemainingTimeFirst(const std::vector<Process>& processes);

#endif // ALGORITHMS_H
