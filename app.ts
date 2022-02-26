import {connectDB} from './services/db'
import { start } from './app/index'

(async function() {

    await connectDB()
    await start()

}())  