const EventEmitter = require('events')
const em = new EventEmitter()

em.on('FirstEvent',(data)=>{
    console.log('First Subscriber:'+data);
})
em.on('SecondEvent',(data)=>{
    console.log('Second Subscriber:'+data);
})
em.emit('FirstEvent','this is my first node js event emit example')
em.emit('SecondEvent','this my second node js event emitter example')