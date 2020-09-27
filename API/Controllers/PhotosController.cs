using System.Threading.Tasks;
using Application.Photos;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class PhotosController : BaseController
    {
        [HttpPost]
        // {
        //     "type": "https://tools.ietf.org/html/rfc7231#section-6.5.13",
        //     "title": "Unsupported Media Type",
        //     "status": 415,
        //     "traceId": "|b99de1b5-4cac2e13cc13c5a4."
        // }
        public async Task<ActionResult<Photo>> Add([FromForm] Add.Command command)
        {
            return await Mediator.Send(command);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<Unit>> Delete(string id)
        {
            return await Mediator.Send(new Delete.Command { Id = id });
        }

        [HttpPost("{id}/setmain")]
        public async Task<ActionResult<Unit>> SetMain(string id)
        {
            return await Mediator.Send(new SetMain.Command { Id = id });
        }
    }
}