const dev = process.env.NODE_ENV !== 'production';
console.log(dev)

export const server = dev ? 'http://localhost:3000' : 'http://ec2-3-141-164-182.us-east-2.compute.amazonaws.com:3000';