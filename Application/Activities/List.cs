using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Persistence;

namespace Application.Activities
{
    public class List
    {
        public class Query : IRequest<List<ActivityDto>> { }

        public class Handler : IRequestHandler<Query, List<ActivityDto>>
        {
            private readonly DataContext _context;
            private readonly ILogger<List> _logger;
            private readonly IMapper _mapper;
            public Handler(DataContext context, ILogger<List> logger, IMapper mapper)
            {
                _mapper = mapper;
                _context = context;
                _logger = logger;
            }

            public async Task<List<ActivityDto>> Handle(Query request, CancellationToken cancellationToken)
            {
                // Demo Cancellation Token
                // ---> Start Here
                // try
                // {
                //     for (var i = 0; i < 10; i++)
                //     {
                //         cancellationToken.ThrowIfCancellationRequested();
                //         await Task.Delay(1000, cancellationToken);
                //         _logger.LogInformation($"Task {i} has completed");
                //     }
                // }
                // catch (Exception e) when (e is TaskCanceledException)
                // {
                //     _logger.LogInformation("Task was cancelled");
                // }
                // ---> End Here
                // throw new System.NotImplementedException();
                // var activities = await _context.Activities
                //     .Include(x => x.UserActivities)
                //     .ThenInclude(x => x.AppUser)
                //     .ToListAsync(cancellationToken);

                // Lazy Loading
                var activities = await _context.Activities
                    .ToListAsync(cancellationToken);

                return _mapper.Map<List<Activity>, List<ActivityDto>>(activities);
            }
        }
    }
}