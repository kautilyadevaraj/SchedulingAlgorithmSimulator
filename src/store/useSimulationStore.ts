import { create } from 'zustand';
import { 
  Process, 
  SimulationResult, 
  AlgorithmConfig, 
  shortestRemainingTimeFirst,
  roundRobinVirtual,
  multiLevelFeedbackQueue
} from '@/lib/Algorithms';

interface SimulationState {
  // Data
  processes: Process[];
  algorithmSettings: AlgorithmConfig;
  simulationResults: {
    SRTF: SimulationResult | null;
    RRV: SimulationResult | null;
    MLFQ: SimulationResult | null;
  };
  
  // Actions
  addProcess: (process: Omit<Process, 'process_id'>) => void;
  updateProcess: (id: number, data: Partial<Process>) => void;
  removeProcess: (id: number) => void;
  clearProcesses: () => void;
  setProcesses: (processes: Process[]) => void;
  
  setAlgorithmSettings: (settings: Partial<AlgorithmConfig>) => void;
  
  runSimulations: () => void;
}

export const useSimulationStore = create<SimulationState>((set, get) => ({
  // Initial State
  processes: [],
  algorithmSettings: {
    quantum: 4,
    mlfqQueues: [
      { id: 0, algorithm: 'RR', quantum: 4 },
      { id: 1, algorithm: 'RR', quantum: 8 },
      { id: 2, algorithm: 'FCFS' },
    ],
  },
  simulationResults: {
    SRTF: null,
    RRV: null,
    MLFQ: null,
  },

  // Actions
  addProcess: (newProcessData) => {
    set((state) => {
      const nextId = state.processes.length > 0 
        ? Math.max(...state.processes.map(p => p.process_id)) + 1 
        : 1;
      
      const newProcess: Process = {
        ...newProcessData,
        process_id: nextId,
      };
      
      const updatedProcesses = [...state.processes, newProcess];
      return { processes: updatedProcesses };
    });
    get().runSimulations();
  },

  updateProcess: (id, data) => {
    set((state) => ({
      processes: state.processes.map((p) => 
        p.process_id === id ? { ...p, ...data } : p
      ),
    }));
    get().runSimulations();
  },

  removeProcess: (id) => {
    set((state) => ({
      processes: state.processes.filter((p) => p.process_id !== id),
    }));
    get().runSimulations();
  },

  clearProcesses: () => {
    set({ 
      processes: [], 
      simulationResults: { SRTF: null, RRV: null, MLFQ: null } 
    });
  },

  setProcesses: (processes) => {
    set({ processes });
    get().runSimulations();
  },

  setAlgorithmSettings: (settings) => {
    set((state) => ({
      algorithmSettings: { ...state.algorithmSettings, ...settings },
    }));
    get().runSimulations();
  },

  runSimulations: () => {
    const { processes, algorithmSettings } = get();
    if (processes.length === 0) {
      set({ 
        simulationResults: { SRTF: null, RRV: null, MLFQ: null } 
      });
      return;
    }

    // Run SRTF
    const srtfResult = shortestRemainingTimeFirst(processes);
    
    // Run RRV
    const rrvResult = roundRobinVirtual(processes, algorithmSettings.quantum);

    // Run MLFQ
    const mlfqResult = multiLevelFeedbackQueue(processes, algorithmSettings.mlfqQueues);

    set({
      simulationResults: {
        SRTF: srtfResult,
        RRV: rrvResult,
        MLFQ: mlfqResult,
      },
    });
  },
}));
