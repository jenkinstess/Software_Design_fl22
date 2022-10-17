import { tickets } from '../../../tickets-data'

export default function handler(req, res) {
  res.status(200).json(tickets)
}