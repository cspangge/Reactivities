using System;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using MediatR;
using Microsoft.Extensions.Logging;
using Persistence;

namespace Application.Activities
{
    public class Delete
    {
        public class Command : IRequest
        {
            public Guid Id { get; set; }
        }

        public class Handler : IRequestHandler<Command>
        {
            private readonly DataContext _context;
            private readonly ILogger<List> _logger;
            public Handler(DataContext context, ILogger<List> logger)
            {
                _context = context;
                _logger = logger;
            }

            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                var activity = await _context.Activities.FindAsync(request.Id);

                // 1. Always return a result object to the API controller
                // 2. One request give a response
                if (activity == null)
                    // throw new Exception("Could not find activity");
                    throw new RestException(HttpStatusCode.NotFound, new { activity = "Not Found" });

                _context.Remove(activity);

                var success = await _context.SaveChangesAsync() > 0;  // Return integer, number of changes saved in database

                if (success) return Unit.Value;

                throw new Exception("Problem saving changes");
            }
        }
    }
}