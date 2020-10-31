import React, {useState, useEffect} from "react";
import {FaPlus} from "react-icons/fa";

import Api from './services/api';

import "./styles.css";

function App() {

  const [repositories, setRepositories] = useState([]);
  const [repositoryName, setRepositoryName] = useState('');

  useEffect(() => {
    Api.get('/repositories').then(response => {
      console.log(response.data);
      setRepositories(response.data)
    })
  }, [])

  async function handleAddRepository() {
    /*if(!repositoryName){
      alert('Digite um nome para o repositório');
      return;
    }*/


    const response = await Api.post('/repositories', {
      title: repositoryName,
      url: 'https://www.github.com/mhbarros',
      owner: 'Marcelo Barros'
    });

    setRepositoryName('');

    setRepositories([...repositories, response.data])
  }

  async function handleRemoveRepository(id) {
    const response = await Api.delete(`/repositories/${id}`);
    if (response.status === 204) {
      const repIndex = repositories.findIndex(rep => rep.id === id);

      if (repIndex >= 0) {
        let newRep = repositories;
        newRep.splice(repIndex, 1);

        setRepositories([...newRep]);
      }
    }
  }

  return (
      <div>
        <h1>Listagem de repositórios</h1>
        <ul data-testid="repository-list">
          {

            repositories.map(rep => (
                <li key={rep.id}>
                  {rep.title}
                  <button onClick={() => {
                    handleRemoveRepository(rep.id)
                  }}>
                    Remover
                  </button>
                </li>
            ))
          }
        </ul>
        <div className={'new-repository'}>
          <input type={'text'} placeholder={'Nome do repositório'} value={repositoryName} onChange={e => {setRepositoryName(e.target.value)}}/>
          <button onClick={handleAddRepository}><FaPlus size={14} color={'white'} />Adicionar</button>
        </div>

      </div>
  );
}

export default App;
