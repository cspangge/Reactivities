using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain;
using Microsoft.AspNetCore.Identity;

namespace Persistence
{
    public class Seed
    {
        public static async Task SeedData(DataContext context, UserManager<AppUser> userManager)
        {
            if (!userManager.Users.Any())
            {
                var users = new List<AppUser>
                {
                    new AppUser
                    {
                        Id = "a",
                        DisplayName = "Alice",
                        UserName = "alice",
                        Email = "alice@demo.com"
                    },
                    new AppUser
                    {
                        Id = "b",
                        DisplayName = "Bob",
                        UserName = "bob",
                        Email = "bob@demo.com"
                    },
                    new AppUser
                    {
                        Id = "c",
                        DisplayName = "Charlie",
                        UserName = "charlie",
                        Email = "charlie@demo.com"
                    }
                };
                foreach (var user in users)
                {
                    await userManager.CreateAsync(user, "Abc123.");
                }
            }
            if (!context.Activities.Any())
            {
                var activities = new List<Activity>
                {
                    new Activity
                    {
                        Title = "Feature 1",
                        Date = DateTime.Now.AddMonths(1),
                        Description = "Activity 1",
                        Category = "music",
                        City = "London",
                        Venue = "01 Sample",
                        UserActivities = new List<UserActivity>
                        {
                            new UserActivity
                            {
                                AppUserId = "a",
                                IsHost = true,
                                DateJoined = DateTime.Now.AddMonths(-2)
                            }
                        }
                    },
                    new Activity
                    {
                        Title = "Feature 2",
                        Date = DateTime.Now.AddMonths(2),
                        Description = "Activity 2",
                        Category = "movie",
                        City = "Sydney",
                        Venue = "02 Sample",
                        UserActivities = new List<UserActivity>
                        {
                            new UserActivity
                            {
                                AppUserId = "b",
                                IsHost = true,
                                DateJoined = DateTime.Now.AddMonths(-1)
                            },
                            new UserActivity
                            {
                                AppUserId = "a",
                                IsHost = false,
                                DateJoined = DateTime.Now.AddMonths(-1)
                            },
                        }
                    },
                    new Activity
                    {
                        Title = "Feature 3",
                        Date = DateTime.Now.AddMonths(3),
                        Description = "Activity 3",
                        Category = "book",
                        City = "New York",
                        Venue = "03 Sample",
                        UserActivities = new List<UserActivity>
                        {
                            new UserActivity
                            {
                                AppUserId = "b",
                                IsHost = true,
                                DateJoined = DateTime.Now.AddMonths(1)
                            },
                            new UserActivity
                            {
                                AppUserId = "a",
                                IsHost = false,
                                DateJoined = DateTime.Now.AddMonths(1)
                            },
                        }
                    },
                    new Activity
                    {
                        Title = "Feature 4",
                        Date = DateTime.Now.AddMonths(4),
                        Description = "Activity 4",
                        Category = "book",
                        City = "New York",
                        Venue = "04 Sample",
                        UserActivities = new List<UserActivity>
                        {
                            new UserActivity
                            {
                                AppUserId = "c",
                                IsHost = true,
                                DateJoined = DateTime.Now.AddMonths(5)
                            },
                            new UserActivity
                            {
                                AppUserId = "b",
                                IsHost = false,
                                DateJoined = DateTime.Now.AddMonths(5)
                            },
                        }
                    }
                };
                context.Activities.AddRange(activities);
                context.SaveChanges();
            }
        }
    }
}