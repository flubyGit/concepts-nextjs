import axios from 'axios'
import { useRouter } from 'next/router'
import { User } from '../../../api/User';
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next'

export interface UserProps {
  user: User
}
function Profile({ user }: InferGetStaticPropsType<typeof getStaticProps>){
  const router = useRouter()

  if(router.isFallback)
    return <h1>Carregando...</h1>
  return (
    <aside>
      <p>{user.id}</p>
      <p>{user.name}</p>
      <p>{user.username}</p>
    </aside>
  )
}

export const getStaticProps: GetStaticProps<UserProps> = async context => {
  const { data } = await axios.get('https://jsonplaceholder.typicode.com/users', {
    params: { id: context.params.id }
  })

  const user = await data[0]

  return {
    props : { user, revalidate: 10 }
  }
}
export const getStaticPaths: GetStaticPaths = async () => {
  const response = await axios.get('https://jsonplaceholder.typicode.com/users')
  
  const users = await response.data.slice(0, 5)
  
  const paths = users.map(({ id }) => {
    return {
      params: {
        id: String(id)
      }
    }
  })
  return {
    paths,
    fallback: true
  }
}

export default Profile