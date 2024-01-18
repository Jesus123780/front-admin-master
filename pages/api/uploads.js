
import nextConnect from 'next-connect'
import multer from 'multer'

const upload = multer({
  storage: multer.diskStorage({
    destination: './public/uploads',
    filename: (req, file, cb) => { return cb(null, file.originalname) }
  })
})

const app = nextConnect({
  onError (error, req, res) {
    res.status(501).json({ error: `Sorry something Happened! ${error.message}` })
  },
  onNoMatch (req, res) {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` })
  }
})

app.use(upload.array('theFiles'))

app.post((req, res) => {
  res.status(200).json({ data: 'success' })
})

export default app

export const config = {
  api: {
    bodyParser: false // Disallow body parsing, consume as stream
  }
}
