# Scheduling Algorithm Simulator - AGENTS.md

## 🚀 Misión del Proyecto

Este simulador es una herramienta educativa de alto rendimiento diseñada para que cualquier persona ("para dummies") pueda entender y comparar algoritmos de planificación de procesos en tiempo real, sin complicaciones ni interfaces saturadas.

---

## 🏛️ Arquitectura del Simulador

### 1. El Motor: `@lib/Algorithms.ts`

Toda la lógica de simulación reside aquí. Es una librería pura, sin efectos secundarios, que recibe datos y devuelve resultados comparables.

- **Entrada**: 
  - `Process[]`: Array de procesos con `id`, `arrival_time`, `burst_time` y `priority`.
  - `Config`: Parámetros globales (Quantum para RRV, configuración de colas para MLFQ).
- **Salida**: `SimulationResult[]`: Un array de resultados para facilitar la comparación inmediata.
- **Algoritmos Soportados (Exclusivos)**:
  - **SRTF**: Shortest Remaining Time First (Preventivo). Es la evolución de SJF pero con capacidad de interrupción.
  - **RRV (Round Robin Virtual)**: Usa una cola auxiliar de prioridad para procesos que regresan de E/S, permitiéndoles terminar su quantum pendiente.
  - **MLFQ (Multi-Level Feedback Queue)**: Sistema de máximo 3 colas, con algoritmos y niveles configurables por el usuario.

---

## 🛠️ Guía para Desarrolladores / Agentes

### Reglas de Oro

1. **Strict Algorithm Focus**: El simulador se enfoca ÚNICAMENTE en **SRTF**, **RRV** y **MLFQ**. No implementar FCFS, SJF (no-preventivo) ni otros algoritmos fuera de esta tríada.
2. **Dummies First**: Si una funcionalidad es difícil de explicar, es difícil de usar. Simplificá la UI.
3. **Core Integrity**: Cualquier cambio en la lógica de cálculo DEBE hacerse exclusivamente en `lib/Algorithms.ts`.
4. **Shared State**: Los inputs son globales. Si cambio un `burst_time` en la tabla, todos los algoritmos se re-calculan al instante.
5. **Visualización Responsiva**: Los modales y la grilla deben adaptarse usando Tailwind CSS.

---

## 🧠 Lógica de los Nuevos Algoritmos

### RRV (Round Robin Virtual)
- Los procesos que agotan su quantum vuelven a la cola estándar.
- Los procesos que regresan de una interrupción/bloqueo van a la **cola virtual** para completar su tiempo restante antes de que los nuevos procesos de la cola estándar tomen el CPU.

### MLFQ (Máximo 3 Colas)
- **Q0 (Alta)**: Generalmente RR con quantum corto.
- **Q1 (Media)**: RR con quantum más largo o SRTF.
- **Q2 (Baja)**: FCFS o el algoritmo de base.
- El usuario decide qué algoritmo corre en cada nivel.

---

¡A darle átomos! Si ves una forma de hacer que la comparación sea más visual o intuitiva, metele para adelante. 🚀
