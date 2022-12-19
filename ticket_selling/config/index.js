const dev = process.env.NODE_ENV !== 'production';
console.log(dev)

export const server = dev ? 'http://localhost:3000' : 'http://ec2-3-15-187-114.us-east-2.compute.amazonaws.com:3000';
// export const server = 'http://ec2-13-59-1-157.us-east-2.compute.amazonaws.com:3000/';