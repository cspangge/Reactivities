using System;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using Domain;
using MediatR;
using Persistence;
using static Application.Activities.Details;

namespace Application.Activities
{
    public class Details
    {
        public class Query : IRequest<Activity>
        {
            public Guid Id { get; set; }
        }
    }

    public class Handler : IRequestHandler<Query, Activity>
    {
        private readonly DataContext _context;
        public Handler(DataContext context)
        {
            _context = context;
        }

        public async Task<Activity> Handle(Query request, CancellationToken cancellationToken)
        {
            // Testing 500 Error
            // Start Here
            // throw new Exception("Server stop working");
            // End Here

            var activity = await _context.Activities.FindAsync(request.Id);

            if (activity == null)
                // throw new Exception("Could not find activity");
                throw new RestException(HttpStatusCode.NotFound, new { activity = "Not Found" });

            return activity;
        }
    }
}