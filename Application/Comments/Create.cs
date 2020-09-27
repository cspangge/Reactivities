using System.Net;
using System;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using AutoMapper;
using MediatR;
using Persistence;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using Domain;

namespace Application.Comments
{
    public class Create
    {
        public class Command : IRequest<CommentDto>
        {
            public string Body { get; set; }
            public Guid ActivityId { get; set; }
            public string Username { get; set; }
        }

        public class Handler : IRequestHandler<Command, CommentDto>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            public Handler(DataContext context, IMapper mapper)
            {
                _mapper = mapper;
                _context = context;
            }

            public async Task<CommentDto> Handle(Command request, CancellationToken cancellationToken)
            {
                // Handler logic goes here
                var activity = await _context.Activities.FindAsync(request.ActivityId);

                if (activity == null)
                    new RestException(HttpStatusCode.NotFound, new { Activity = "Not found" });

                var user = await _context.Users.SingleOrDefaultAsync(x => x.UserName == request.Username);

                var comment = new Comment
                {
                    Author = user,
                    Activity = activity,
                    Body = request.Body,
                    CreatedAt = DateTime.Now
                };

                activity.Comments.Add(comment);

                var success = await _context.SaveChangesAsync() > 0;  // Return integer, number of changes saved in database

                if (success) return _mapper.Map<CommentDto>(comment);

                throw new Exception("Problem saving changes");
            }
        }
    }
}