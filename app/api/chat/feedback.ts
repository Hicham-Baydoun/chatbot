import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { rating, feedback } = req.body;
      const docRef = await addDoc(collection(db, 'feedback'), {
        rating,
        feedback,
        timestamp: new Date()
      });
      res.status(200).json({ id: docRef.id, message: 'Feedback submitted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error submitting feedback', error });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}