import {NextApiRequest, NextApiResponse} from 'next'

export default function ticketsByPerson(req: NextApiRequest, res: NextApiResponse){
    res.json({byId: req.query.id, method: req.method});
}