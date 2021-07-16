import React from 'react';
import Box from '../src/components/Box';
import MainGrid from '../src/components/MainGrid';
import { ProfileRelationsBoxWrapper } from '../src/components/ProfileRelations';
import { AlurakutMenu, AlurakutProfileSidebarMenuDefault, OrkutNostalgicIconSet } from '../src/lib/AluraKutCommons';

function ProfileSideBar(propriedades) {
  const [userProfile, setUserProfile] = React.useState('');

  console.log(propriedades);

  React.useEffect(() => {
    fetch('https://api.github.com/users/rowns07')
      .then(userInfo => {
        return userInfo.json().then(user => {
          // console.log('DADOS DO user', user);
          setUserProfile(user);
          // console.log('DADOS DO userProfile', userProfile);
        }).catch(error => {
          console.log(error)
        })
      });

  }, [])

  return (
    <Box>
      {/* <img src={`https://github.com/${propriedades.userName}.png`} style={{ borderRadius: '8px' }} /> */}
      <img src={userProfile.avatar_url} style={{ borderRadius: '8px' }} />

      <hr />
      {/* <a className="boxLink" href={`https://github.com/${propriedades.userName}`}> */}
      <a className="boxLink" href={userProfile.html_url} target='_blank'>
        @{userProfile.login}
      </a>
      <hr />
      <h3>{userProfile.name}</h3>
      <small>Masculino, <br />Solteiro(a),<br />Brasil</small>
      <hr />
      <AlurakutProfileSidebarMenuDefault />

    </Box>
  )
}

export default function Home() {
  const githubUser = 'rowns07';
  const [followedUsers, setFollowedUsers] = React.useState(['']);

  const api_url = 'https://api.github.com/users/rowns07/following';

  const loadData = async () => {
    const response = await fetch(api_url);
    const data = await response.json();
    console.log('CONST DATA', data);
    setFollowedUsers(data);
    // console.log('CONST FOLL', followedUsers[0].login);

  }

  React.useEffect(() => {
    loadData();


    fetch('https://graphql.datocms.com/', {
      method: 'POST',
      headers: {
        'Authorization': '8690ac24997b37ce59820e51c402ca',
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        "query": `query {
            allCommunities{
              title
              id
              imageUrl
          }
        }` })
    }).then((response) => response.json())
      .then((respostaCompleta) => {
        const comunidadesVindasDoDato = respostaCompleta.data.allCommunities;
        console.log('Do Dato:', comunidadesVindasDoDato)
        setComunidades(comunidadesVindasDoDato);
      })
  }, [])


  React.useState()
  const [comunidades, setComunidades] = React.useState([
    // {
    //   id: '001',
    //   title: 'Odeio acordar cedo',
    //   image: `http://picsum.photos/200`
    // }
  ]);

  const pessoasFavoritas = [
    'marcobrunodev',
    'omariosouto',
    'felipefialho',
    'raphaelfabeni',
    'juunegreiros',
    'peas'
  ];

  function handleSendForm(e) {
    e.preventDefault();
    const dadosDoForm = new FormData(e.target);

    console.log('CAMPO:', dadosDoForm.get('title'));
    console.log('CAMPO:', dadosDoForm.get('imageURL'));

    const comunidade = {
      title: dadosDoForm.get('title'),
      imageUrl: `http://picsum.photos/200?${new Date().toISOString()}`,
      creatorSlug: githubUser,
    }

    fetch('/api/comunidades', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(comunidade)
    })
      .then(async (response) => {
        const dados = await response.json();
        console.log('DADOS --->', dados.registroCriado);
        const comunidade = dados.registroCriado;
        const comunidadesAtualizadas = [...comunidades, comunidade]
        setComunidades(comunidadesAtualizadas);
      })


    // console.log('COMUNIDADES', comunidades);

  }

  return (
    <>
      <AlurakutMenu />
      <MainGrid>
        <div className="profileArea" style={{ gridArea: 'profileArea' }}>
          <ProfileSideBar userName={githubUser} />
        </div>
        <div className="welcomeArea" style={{ gridArea: 'welcomeArea' }}>
          <Box>
            <h1>
              Bem vindo (a)
            </h1>
            <OrkutNostalgicIconSet />
          </Box>
          <Box>
            <h2 className="subTitle">O que você deseja fazer?</h2>
            <form onSubmit={handleSendForm}>
              <div>
                <input
                  name="title"
                  area-label="Digite aqui o nome da comunidade"
                  placeholder="Digite aqui o nome da comunidade"
                  type="text"
                // onChange={e.target().value}
                />
              </div>
              {/* <div>
                <input
                  name="image"
                  area-label="Coloque a URL para usarmos de capa..."
                  placeholder="Coloque a URL para usarmos de capa..."
                  type="text"

                />
              </div> */}
              <div>
                <button>Criar comunidade</button>
              </div>
            </form>
          </Box>
        </div>
        <div className="profileRelationsArea" style={{ gridArea: 'profileRelationsArea' }}>
          <ProfileRelationsBoxWrapper>
            <h2 className="smallTitle">
              Pessoas da Comunidade ({pessoasFavoritas.length})


              <ul>

                {followedUsers.map((user) => {
                  return (
                    <li key={user.login}>
                      <a href={`/users/${user.login}`}>
                        <img src={`https://github.com/${user.login}.png`} />
                        <span>{user.login}</span>
                      </a>
                    </li>
                  )
                })}
              </ul>

            </h2>
            <ul>
              {pessoasFavoritas.map((itemAtual) => {
                return (
                  <li key={itemAtual}>
                    <a href={`/users/${itemAtual}`}>
                      <img src={`https://github.com/${itemAtual}.png`} />
                      <span>
                        {itemAtual}
                      </span>
                    </a>
                  </li>
                )
              })}
            </ul>
          </ProfileRelationsBoxWrapper>

          <ProfileRelationsBoxWrapper>
            <h2 className="smallTitle">
              Comunidades ({comunidades.length})
            </h2>
            <ul>
              {comunidades.map((itemAtual) => {
                return (
                  <li key={itemAtual.id}>
                    <a href={`/users/${itemAtual.title}`} key={itemAtual.title}>
                      <img src={itemAtual.imageUrl} />
                      <span>
                        {itemAtual.title}
                      </span>
                    </a>
                  </li>
                )
              })}
            </ul>
          </ProfileRelationsBoxWrapper>
        </div>
      </MainGrid>
    </>
  )
}
