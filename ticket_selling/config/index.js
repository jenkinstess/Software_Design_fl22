const dev = process.env.NODE_ENV !== 'production';

export const server = dev ? 'http://localhost:3000' : 'https://ec2-3-139-99-32.us-east-2.compute.amazonaws.com/';