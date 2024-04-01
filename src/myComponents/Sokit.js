import io from 'socket.io-client'

const sokit = io.connect('http://localhost:4000')

export default sokit