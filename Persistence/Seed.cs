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
                        DisplayName = "Alice",
                        UserName = "alice",
                        Email = "alice@demo.com"
                    },
                    new AppUser
                    {
                        DisplayName = "Bob",
                        UserName = "bob",
                        Email = "bob@demo.com"
                    },
                    new AppUser
                    {
                        DisplayName = "Charlie",
                        UserName = "charlie",
                        Email = "charlie@demo.com"
                    }
                };
                foreach (var user in users)
                {
                    await userManager.CreateAsync(user, "Pangge1104..");
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
                        Venue = "01 Sample"
                    },
                    new Activity
                    {
                        Title = "Feature 2",
                        Date = DateTime.Now.AddMonths(2),
                        Description = "Activity 2",
                        Category = "movie",
                        City = "Sydney",
                        Venue = "02 Sample"
                    },
                    new Activity
                    {
                        Title = "Feature 3",
                        Date = DateTime.Now.AddMonths(3),
                        Description = "Activity 3",
                        Category = "book",
                        City = "New York",
                        Venue = "03 Sample"
                    }
                };
                context.Activities.AddRange(activities);
                context.SaveChanges();
            }
        }
    }
}