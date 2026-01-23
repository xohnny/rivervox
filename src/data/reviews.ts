import { Review } from '@/types';

export const sampleReviews: Review[] = [
  {
    id: '1',
    productId: '1',
    customerName: 'Ahmed Al-Rashid',
    rating: 5,
    title: 'Exceptional Quality!',
    comment: 'The craftsmanship on this thobe is outstanding. The gold embroidery is even more beautiful in person. Perfect fit and extremely comfortable fabric. Highly recommend!',
    createdAt: new Date('2024-01-15'),
    verified: true,
  },
  {
    id: '2',
    productId: '1',
    customerName: 'Khalid Mohammed',
    rating: 4,
    title: 'Great for Eid',
    comment: 'Wore this for Eid prayers and received many compliments. The emerald color is rich and elegant. Only giving 4 stars because shipping took a bit longer than expected.',
    createdAt: new Date('2024-01-10'),
    verified: true,
  },
  {
    id: '3',
    productId: '1',
    customerName: 'Yusuf Ibrahim',
    rating: 5,
    title: 'Premium Quality',
    comment: 'This is my third purchase from Rivervox and they never disappoint. The attention to detail is remarkable.',
    createdAt: new Date('2024-01-05'),
    verified: true,
  },
  {
    id: '4',
    productId: '2',
    customerName: 'Fatima Hassan',
    rating: 5,
    title: 'Beautiful Abaya',
    comment: 'The fabric flows beautifully and the gold trim adds such an elegant touch. Perfect for special occasions.',
    createdAt: new Date('2024-01-12'),
    verified: true,
  },
  {
    id: '5',
    productId: '2',
    customerName: 'Aisha Mahmoud',
    rating: 4,
    title: 'Lovely Design',
    comment: 'Very happy with this purchase. The deep green color is exactly as shown in the photos. Comfortable to wear all day.',
    createdAt: new Date('2024-01-08'),
    verified: true,
  },
  {
    id: '6',
    productId: '3',
    customerName: 'Omar Suleiman',
    rating: 5,
    title: 'Perfect Everyday Wear',
    comment: 'The cotton blend is so soft and breathable. Great for daily wear and the cream color is very versatile.',
    createdAt: new Date('2024-01-14'),
    verified: true,
  },
  {
    id: '7',
    productId: '4',
    customerName: 'Mariam Al-Qasim',
    rating: 5,
    title: 'Best Hijab Ever',
    comment: 'The chiffon quality is amazing! Lightweight, doesn\'t slip, and the subtle shimmer is perfect for both everyday and special occasions.',
    createdAt: new Date('2024-01-11'),
    verified: true,
  },
  {
    id: '8',
    productId: '5',
    customerName: 'Layla Ahmed',
    rating: 5,
    title: 'My Son Loves It',
    comment: 'Bought this for my 6-year-old and he looks so adorable! The fabric is soft and easy to care for. Will buy more sizes as he grows.',
    createdAt: new Date('2024-01-09'),
    verified: true,
  },
];

export const getProductReviews = (productId: string): Review[] => {
  return sampleReviews.filter(r => r.productId === productId);
};

export const getAverageRating = (productId: string): number => {
  const reviews = getProductReviews(productId);
  if (reviews.length === 0) return 0;
  const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
  return Math.round((sum / reviews.length) * 10) / 10;
};

export const getRatingDistribution = (productId: string): Record<number, number> => {
  const reviews = getProductReviews(productId);
  const distribution: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviews.forEach(r => {
    distribution[r.rating]++;
  });
  return distribution;
};
