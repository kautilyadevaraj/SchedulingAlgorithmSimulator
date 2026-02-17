# Shortest Job Simulator - AGENTS.md

## 🚀 Misión del Proyecto

Este simulador está diseñado para ser una herramienta educativa de alto rendimiento enfocada en la familia de algoritmos **Shortest Job**. Permite comparar las variantes **SJF** (No-preventivo) y **SRTF** (Preventivo).

---

## 🏛️ Arquitectura del Simulador

### 1. El Cerebro: `@lib/ShortestJobFirst.ts`

Toda la lógica de simulación vive acá. No se permiten efectos secundarios ni cálculos dispersos en la UI.

- **Entrada**: Un array de procesos (`Process[]`).
- **Salida**: Un objeto `SimulationResult`.
- **Funciones**:
  - `shortestJobFirst`: Implementación No-preemptiva.
  - `shortestRemainingTimeFirst`: Implementación Preemptiva.

### 2. Flujo de Datos

- **State Management**: Todo el estado de la simulación nace en `MainForm.tsx`.
- **Visualización**: Se muestran ambos resultados en pestañas (Tabs) para facilitar la comparación.

---

## 🛠️ Guía para Desarrolladores / Agentes

### Reglas de Oro

1. **Shortest Job Only**: No intentes meter otros algoritmos (FCFS, Round Robin, etc.) a menos que sea pedido explícitamente. El foco es "Shortest Job".
2. **Pure Logic**: Cualquier cambio en cómo se calcula el tiempo de espera o el orden de ejecución debe hacerse en `lib/ShortestJobFirst.ts`.
3. **Responsive UI**: Asegurá que los gráficos (Gantt) se adapten a diferentes tamaños de pantalla. Usamos Tailwind CSS para esto.

---

## 🧠 Lógica de Planificación

### SJF (No-preventivo)

1. Los procesos se ordenan inicialmente por `arrival_time`.
2. Se elige el que tenga el **menor `burst_time`** de entre los que ya llegaron.
3. El proceso corre hasta terminar.

### SRTF (Preventivo)

1. En cada unidad de tiempo, se re-evalúa el proceso con el **menor tiempo restante (remaining_time)**.
2. Un proceso nuevo puede interrumpir al actual si su ráfaga es menor que el tiempo restante del actual.
3. Desempate: `arrival_time` y luego `process_id`.

---

¡Dale para adelante con todo! Si ves algo que se puede optimizar en el cálculo del algoritmo o la visualización del Gantt, no dudes en proponerlo. 🚀
