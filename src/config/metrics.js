const client = require("prom-client");

const register =new client.Registry(); // Registry is collection of metrics exposed to prometheus. 

client.collectDefaultMetrics({
    register : register 
});

const httpRequestsTotal = new client.Counter({ //it basically counts the http request, its value only goes upwards
    name: "http_requests_total",
    help: "total number of HTTP requests"
});

register.registerMetric(httpRequestsTotal); // add httpRequestsTotal metric   to thec ollection

const httpRequestDuration = new client.Histogram({
    name: "http_request_duration_seconds",
    help: "Duration of HTTP requests in seconds",
    buckets: [0.05, 0.1, 0.2, 0.5, 1, 2, 5]
});
// histogram(how fast your api resonds)
register.registerMetric(httpRequestDuration);

const httpErrorsTotal = new client.Counter({
    name: "http_errors_total",
    help: "Total number of HTTP error responses"
});
//how many requests returned error
register.registerMetric(httpErrorsTotal);


module.exports= {
    register: register,
    httpRequestsTotal: httpRequestsTotal,
    httpRequestDuration: httpRequestDuration,
     httpErrorsTotal: httpErrorsTotal
};