import express from "express"
import {prisma} from "./utils/prisma.js"

const app = express()

app.get('/', async (req,res) => {
    const Users = await prisma.Users.findMany()

    res.json(users)
})

app.listen(3000)


