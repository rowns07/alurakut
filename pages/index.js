import React from 'react';
import Box from '../src/components/Box';
import MainGrid from '../src/components/MainGrid';
import { ProfileRelationsBoxWrapper } from '../src/components/ProfileRelations';
import { AlurakutMenu, AlurakutProfileSidebarMenuDefault, OrkutNostalgicIconSet } from '../src/lib/AluraKutCommons';
import nookies from 'nookies';
import jwt from 'jsonwebtoken';

function ProfileSideBar({ propriedades }) {
  const { avatar_url, login, html_url, name } = propriedades;

  // React.useEffect(() => {
  //   console.log('QUem é u user', props.githubUser);
  //   fetch(`https://api.github.com/users/${githubUser}`)
  //     .then(userInfo => {
  //       return userInfo.json().then(user => {
  //         // console.log('DADOS DO user', user);
  //         setUserProfile(user);
  //         console.log('DADOS DO userProfile', userProfile);
  //       }).catch(error => {
  //         console.log(error)
  //       })
  //     });

  // }, [])

  return (
    <Box>
      <img src={avatar_url} style={{ borderRadius: '8px' }} />

      <hr />
      <a className="boxLink" href={html_url} target='_blank'>
        @{login}
      </a>
      <hr />
      <h3>{name}</h3>
      <small>Masculino, <br />Solteiro(a),<br />Brasil</small>
      <hr />
      <AlurakutProfileSidebarMenuDefault />

    </Box>
  )
}

export default function Home(props) {
  const githubUser = props.githubUser;
  const [userProfile, setUserProfile] = React.useState('');
  const [followedUsers, setFollowedUsers] = React.useState(['']);
  const [comunidades, setComunidades] = React.useState([]);

  const loadData = async () => {
    const api_url = `https://api.github.com/users/${githubUser}/following`;
    const response = await fetch(api_url);
    const data = await response.json();
    // console.log('CONST DATA', data);
    setFollowedUsers(data);
    // console.log('CONST FOLL', followedUsers[0].login);

  }

  const getUser = async () => {
    const response = await fetch(`https://api.github.com/users/${githubUser}`)

    const dadosUser = await response.json()
    console.log('dadosUser', dadosUser)
    setUserProfile(dadosUser);

  }

  React.useEffect(() => {
    loadData();
    getUser();
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
        setComunidades(comunidadesVindasDoDato);
      })
  }, [])

  function handleSendForm(e) {
    e.preventDefault();
    const dadosDoForm = new FormData(e.target);

    // console.log('CAMPO:', dadosDoForm.get('title'));
    // console.log('CAMPO:', dadosDoForm.get('imageURL'));

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
        const comunidade = dados.registroCriado;
        const comunidadesAtualizadas = [...comunidades, comunidade]
        setComunidades(comunidadesAtualizadas);
      })
  }

  return (
    <>
      <AlurakutMenu />
      <MainGrid>
        <div className="profileArea" style={{ gridArea: 'profileArea' }}>
          <ProfileSideBar propriedades={userProfile} />
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
              Pessoas da Comunidade API ({followedUsers.length})
            </h2>


            <ul>
              {followedUsers.map((user) => {
                return (
                  <li>
                    <a href={`/users/${user.login}`} key={user.id}>
                      <img src={user.avatar_url} />
                      <span>{user.login}</span>
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
                  <li>
                    <a href={`/users/${itemAtual.title}`} key={itemAtual.id}>
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

export async function getServerSideProps(context) {
  const cookies = nookies.get(context)
  const token = cookies.USER_TOKEN;
  const { isAuthenticated } = await fetch('https://alurakut.vercel.app/api/auth', {
    headers: {
      Authorization: token
    }
  })
    .then((resposta) => resposta.json());

  console.log(isAuthenticated)
  console.log(token)



  if (!isAuthenticated) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      }
    }
  }

  const { githubUser } = jwt.decode(token);

  return {
    props: {
      githubUser
    }, // will be passed to the page component as props
  }
}
