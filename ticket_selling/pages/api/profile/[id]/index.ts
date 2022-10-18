const db = require('/config/database');
import {NextApiRequest, NextApiResponse} from 'next'

export default function Home(req: NextApiRequest, res: NextApiResponse){
    res.json({byId: req.query.id, method: req.method});
}