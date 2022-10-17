import { events } from '../../../events-data'

export default function handler(req, res) {
  res.status(200).json(events)
}