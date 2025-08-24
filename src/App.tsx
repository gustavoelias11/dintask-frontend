import React, { useState, useEffect } from 'react';
import './App.css';

// 1. O "Modelo da Ficha" no Frontend
//    Assim como criamos a classe Task no Java, criamos uma "interface"
//    no TypeScript. Ela diz ao nosso frontend: "Uma tarefa SEMPRE
//    terá um 'id' (número), uma 'description' (texto) e um 'done' (booleano)".
//    Isso nos ajuda a evitar erros de digitação no futuro.
interface Task {
  id: number;
  description: string;
  done: boolean;
}

function App() {
  // 2. Nossos "Quadros-Negros" (Estados)
  //    Agora temos dois!
  //    - 'tasks': Para guardar a lista de tarefas que vem do backend. Começa vazia [].
  //    - 'newTaskDescription': Para guardar o texto que o usuário está digitando.
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskDescription, setNewTaskDescription] = useState('');

  // 3. O "Garçom" que busca o cardápio inicial
  //    Este useEffect busca a lista de tarefas UMA VEZ, quando a página carrega.
  useEffect(() => {
    // A URL agora é a do nosso TaskController
    fetch('http://localhost:8080/api/tasks')
      // A resposta agora é um JSON, então usamos .json() para decodificá-la.
      .then(response => response.json())
      // Usamos o "giz mágico" para escrever a lista de tarefas no nosso quadro-negro.
      .then(data => setTasks(data));
  }, []);

  // 4. A função para "Anotar um Novo Pedido" (Criar uma nova tarefa)
  //    Esta função é chamada quando o formulário é enviado.
  const handleSubmit = (e: React.FormEvent) => {
    // e.preventDefault() impede o navegador de recarregar a página,
    // que é o comportamento padrão de um formulário.
    e.preventDefault();

    // Enviamos o pedido para a "cozinha" (backend)
    fetch('http://localhost:8080/api/tasks', {
      method: 'POST', // O método agora é POST
      headers: {
        // O "crachá" avisando que estamos enviando JSON
        'Content-Type': 'application/json',
      },
      // O corpo do pedido. JSON.stringify() converte nosso objeto JS
      // para o formato de texto JSON que o backend espera.
      body: JSON.stringify({ description: newTaskDescription }),
    })
      .then(response => response.json())
      .then(createdTask => {
        // Quando a cozinha devolve a tarefa criada (com ID), nós a
        // adicionamos à nossa lista no quadro-negro.
        setTasks(currentTasks => [...currentTasks, createdTask]);
        // Limpamos o campo de digitação para o usuário.
        setNewTaskDescription('');
      });
  };

  // 5. A "Parte Visual" (O que é desenhado na tela)
  return (
    <div className="App">
      <header className="App-header">
        <h1>Minha Lista de Tarefas</h1>

        {/* O Formulário para adicionar novas tarefas */}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={newTaskDescription}
            onChange={e => setNewTaskDescription(e.target.value)}
            placeholder="O que precisa ser feito?"
          />
          <button type="submit">Adicionar</button>
        </form>

        {/* A Lista onde as tarefas são exibidas */}
        <ul>
          {/* Usamos .map() para transformar cada item do nosso array 'tasks'
              em um elemento <li> na tela. */}
          {tasks.map(task => (
            // A 'key' é um identificador especial para o React saber
            // qual item é qual na lista.
            <li key={task.id}>
              {task.description}
            </li>
          ))}
        </ul>
      </header>
    </div>
  );
}

export default App;