using AutoMapper;
using Domain;

namespace Application.Activities
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<Activity, ActivityDto>();
            CreateMap<UserActivity, AttendeeDto>()
                .ForMember(des => des.Username, options => options.MapFrom(src => src.AppUser.UserName))
                .ForMember(des => des.DisplayName, options => options.MapFrom(src => src.AppUser.DisplayName));
        }
    }
}