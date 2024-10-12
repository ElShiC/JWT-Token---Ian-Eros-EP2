import express from "express"
import jwt from "jsonwebtoken"
import cors from "cors"


const PUERTO = 3000

const app = express()
app.use(express.json())
app.use(cors())
const SECRET_KEY = 'ep2-eva'

const admin = {
  user: 'eros',
  password: 'madagascar.4'
}

app.post('/login', (req, res) => {
  if(req.body.user.trim() === admin.user && req.body.password === admin.password){
    console.log('Bievenido administrador ' + req.body.user)
    const token = jwt.sign(admin, SECRET_KEY, {expiresIn: '1h'})
    return res.status(202).json({token: token})
  } else {
    return res.status(401).json({status: 401, message: "Fallo al iniciar sesion"})
  }
})

const verificarToken = (req, res, next) => {
  const authorization = req.headers['authorization']
  const token = authorization.split(' ')[1]

  if (token) {
    jwt.verify(token, SECRET_KEY, (err, user) => {
      if (err) {
        return res.status(404).json({status: 401, message: "Fallo al ingresar"})
      }
      req.user = user
      next()
    })
  } else {
    return res.status(404).json({status: 401, message: "Fallo al ingresar"})
  }
};

app.get('/bienvenido', verificarToken, (req, res) => {
  return res.json({user: req.user})
})


app.listen(PUERTO, () => {
  console.log(`http://localhost:${PUERTO}`)
})