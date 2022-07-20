const EventEmitter = require('events')



function LoopProcessor(num) {
    const em = new EventEmitter()
    setTimeout(function() {
     for (let i = 0; i <=num ; i++) {
         em.emit('BeforeProcess',i)
         console.log('Processing number:'+i);
         em.emit('AfterProcess',i)
         
     }   
    },2000)
    return em}
    const lp = LoopProcessor(3)
    
    lp.on('BeforeProcess',function(data) {
        console.log('About to start the process for'+data);
    })
    lp.on('AfterProcess',function(data) {
        console.log('Completed Processing'+data);
    })
