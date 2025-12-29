import Child from './Child'
import Container from './Container'

export default function Page() {
  return (
    <div>
      <Container content={<Child />}></Container>
    </div>
  )
}
