using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Application.Activities;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class ActivitiesController : BaseController
    {
        [HttpGet]
        // Demo Cancellation Token
        // ---> Start Here
        // public async Task<ActionResult<List<Activity>>> List(CancellationToken cancellationToken)
        // {
        //     return await _mediator.Send(new List.Query(), cancellationToken);
        // }
        // ---> End Here
        public async Task<ActionResult<List.ActivitiesEnvelope>> List(int? limit, int? offset, bool isGoing, bool isHost, DateTime? startDate)
        {
            // Console.WriteLine("1----->" + startDate);
            limit = limit == 0 ? 1 : limit;
            return await Mediator.Send(new List.Query(limit, offset, isGoing, isHost, startDate));
        }

        [HttpGet("{id}")]
        // 200: Ok
        // 204: No Content
        [Authorize]
        public async Task<ActionResult<ActivityDto>> Details(Guid id)
        {
            return await Mediator.Send(new Details.Query { Id = id });
        }

        [HttpPost]
        // Implicitly using [FromBody] here
        public async Task<ActionResult<Unit>> Create([FromBody] Create.Command command)
        {
            // if (!ModelState.IsValid)
            //     return BadRequest(ModelState);
            return await Mediator.Send(command);
        }

        [HttpPut("{id}")]
        [Authorize(Policy = "IsActivityHost")]
        public async Task<ActionResult<Unit>> Edit(Guid id, [FromBody] Edit.Command command)
        {
            command.Id = id;
            return await Mediator.Send(command);
        }

        [HttpDelete("{id}")]
        [Authorize(Policy = "IsActivityHost")]
        public async Task<ActionResult<Unit>> Delete(Guid id)
        {
            return await Mediator.Send(new Delete.Command { Id = id });
        }

        [HttpPost("{id}/attend")]
        public async Task<ActionResult<Unit>> Attend(Guid id)
        {
            return await Mediator.Send(new Attend.Command { Id = id });
        }

        [HttpDelete("{id}/unattended")]
        public async Task<ActionResult<Unit>> Unattended(Guid id)
        {
            return await Mediator.Send(new Unattended.Command { Id = id });
        }
    }
}