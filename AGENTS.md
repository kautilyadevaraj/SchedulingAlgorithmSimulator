# SJF Simulator - AGENTS.md

## 🚀 Misión del Proyecto
Este simulador está diseñado para ser una herramienta educativa de alto rendimiento enfocada exclusivamente en el algoritmo de planificación **Shortest Job First (SJF)**. No es un simulador genérico; es EL simulador de SJF.

---

## 🏛️ Arquitectura del Simulador

### 1. El Cerebro: `@lib/ShortestJobFirst.ts`
Toda la lógica de simulación vive acá. No se permiten efectos secundarios ni cálculos dispersos en la UI.
- **Entrada**: Un array de procesos (`Process[]`).
- **Salida**: Un objeto `SimulationResult` que contiene:
  - `sequence`: La lista de procesos (incluyendo el ID -1 para tiempos de ocio/idle) para el Gantt Chart.
  - `stats`: Promedios globales de tiempo de espera, retorno, utilización y throughput.
  - `processStats`: Detalles individuales por proceso (waiting time, turnaround, start/end).

### 2. Flujo de Datos
- **State Management**: Todo el estado de la simulación nace en `MainForm.tsx`.
- **Componentes de Visualización**:
  - `GanttChart.tsx`: Renderiza la línea de tiempo.
  - `SummaryTable.tsx`: Muestra la tabla comparativa de procesos.
  - `SummaryStatistics.tsx`: Muestra las tarjetas con los promedios y KPIs.

---

## 🛠️ Guía para Desarrolladores / Agentes

### Reglas de Oro
1. **SJF Only**: No intentes meter otros algoritmos (FCFS, Round Robin, etc.). El proyecto fue limpiado para enfocarse solo en SJF.
2. **Pure Logic**: Cualquier cambio en cómo se calcula el tiempo de espera o el orden de ejecución debe hacerse en `lib/ShortestJobFirst.ts`.
3. **Responsive UI**: Asegurá que los gráficos (Gantt) se adapten a diferentes tamaños de pantalla. Usamos Tailwind CSS para esto.
4. **Framer Motion**: Las animaciones son clave para la experiencia educativa. Mantené los efectos de "pop-out" y "stagger" al mostrar resultados.

### Cómo agregar una mejora
1. Si querés agregar una métrica nueva (ej. Response Time):
   - Agregá el campo a `ScheduledProcess` en `ShortestJobFirst.ts`.
   - Calculalo dentro de la función principal de simulación.
   - Actualizá la UI en `SummaryTable.tsx` o `SummaryStatistics.tsx`.

### Stack Tecnológico
- **Framework**: Next.js 15+ (App Router).
- **Styling**: Tailwind CSS + Shadcn UI.
- **Validación**: Zod + React Hook Form.
- **Animaciones**: Framer Motion.
- **Tipado**: TypeScript Estricto.

---

## 🧠 Lógica de Planificación (SJF Non-Preemptive)
1. Los procesos se ordenan inicialmente por `arrival_time`.
2. Se mantiene un `currentTime` que avanza según los procesos ejecutados.
3. Al terminar un proceso, se buscan todos los que ya llegaron (`arrival_time <= currentTime`).
4. Se elige el que tenga el **menor `burst_time`**.
5. **Criterio de Desempate (Tie-breaker)**:
   - Primero por `arrival_time`.
   - Segundo por `process_id`.

---

¡Dale para adelante con todo! Si ves algo que se puede optimizar en el cálculo del algoritmo o la visualización del Gantt, no dudes en proponerlo. 🚀
