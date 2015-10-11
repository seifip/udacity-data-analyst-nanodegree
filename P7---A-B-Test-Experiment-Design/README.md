#A/B Testing Udacity’s Free Trial Screener

##Experiment Design
###Metric Choice
_List which metrics you will use as invariant metrics and evaluation metrics here._

**Invariant metrics:** Number of cookies, Number of clicks, Click-through-probability
**Evaluation metrics:** Gross conversion, Retention, Net conversion

_For each metric, explain both why you did or did not use it as an invariant metric and why you did or did not use it as an evaluation metric. Also, state what results you will look for in your evaluation metrics in order to launch the experiment._

**Number of cookies:** Good invariant metric because the visits happen before the user sees the experiment, and are thus independent from it.
**Number of user-ids:** Not a good invariant metric because the number of users who enroll in the free trial is dependent on the experiment. Not an ideal evaluation metric because the number of visitors may be different between the experiment and control groups, which would skew the results.
**Number of clicks:** Good invariant metric because the clicks happen before the user sees the experiment, and are thus independent from it.
**Click-through-probability:** Good invariant metric because the clicks happen before the user sees the experiment, and are thus independent from it.
**Gross conversion:** Not a good invariant metric because the number of users who enroll in the free trial is dependent on the experiment. Good evaluation metric because it is directly dependent on the effect of the experiment and allows us to show whether we managed to decrease the cost of enrollments that aren’t likely to become paying customers.
**Retention:** Not a good invariant metric because the number of users who enroll in the free trial is dependent on the experiment. Good evaluation metric because it is directly dependent on the effect of the experiment, and also shows positive financial outcome of the change.
**Net conversion:** Not a good invariant metric because the number of users who enroll in the free trial is dependent on the experiment. Good evaluation metric because it is directly dependent on the effect of the experiment, and also shows positive financial outcome of the change.

I will look at Gross conversion and Net conversion. The first metric will show us whether we lower our costs by introducing the screener. The second metric will show how the change affects our revenues.

To launch the experiment, I will require Gross conversion to have a practically significant decrease, and Net conversion to have a statistically significant increase.

###Measuring Standard Deviation
_List the standard deviation of each of your evaluation metrics._

**Gros conversion:** 0.0202
**Net conversion:** 0.0156

_For each of your evaluation metrics, indicate whether you think the analytic estimate would be comparable to the the empirical variability, or whether you expect them to be different (in which case it might be worth doing an empirical estimate if there is time). Briefly give your reasoning in each case._

Gross conversion and net conversion both have the number of cookies as their denominator, which is also our unit of diversion. We can therefore proceed using an analytical estimate of the variance.

###Sizing
####Number of Samples vs. Power
_Indicate whether you will use the Bonferroni correction during your analysis phase, and give the number of pageviews you will need to power you experiment appropriately_

I did not use the Bonferroni correction.

The evaluation metrics I selected to proceed with are **Gross conversion** and **Net conversion**.

I will need 685 324 pageviews to power the experiment with these metrics. That is, double (control + experiment groups) of the number of samples required for the more demanding of the two metrics, Net conversion.

####Duration vs. Exposure
_Indicate what fraction of traffic you would divert to this experiment and, given this, how many days you would need to run the experiment._

I would divert 70% of the traffic to the experiment. Given that, the experiment will take 25 days, which is a reasonable time for our needs.

_Give your reasoning for the fraction you chose to divert. How risky do you think this experiment would be for Udacity?_

The experiment is not extremely risky given that it does not affect existing paying customers, and is simple enough that there is a low chance of bugs occurring in the process. Nevertheless it may have a substantial impact on new enrollments, and diverting 100% of the traffic may thus not be advisable.

##Experiment Analysis
###Sanity Checks
_For each of your invariant metrics, give the 95% confidence interval for the value you expect to observe, the actual observed value, and whether the metric passes your sanity check._

**Number of cookies:** [.4988, .5012]; observed .5006; PASS
**Number of clicks on “Start free trial”:** [.4959, .5041]; observed .5005; PASS
**Click-through-probability on “Start free trial”:** [.0812, .0830]; observed .0822; PASS

###Result Analysis
####Effect Size Tests
_For each of your evaluation metrics, give a 95% confidence interval around the difference between the experiment and control groups. Indicate whether each metric is statistically and practically significant._

**Gross conversion:** [-.0291, -.0120], statistically significant, practically significant
**Net conversion:** [-.0116, .0019], not statistically significant, not practically significant

####Sign Tests
_For each of your evaluation metrics, do a sign test using the day-by-day data, and report the p-value of the sign test and whether the result is statistically significant._

**Gross conversion:** .0026, statistically significant
**Net conversion:** .6776, not statistically significant

####Summary
_State whether you used the Bonferroni correction, and explain why or why not. If there are any discrepancies between the effect size hypothesis tests and the sign tests, describe the discrepancy and why you think it arose._

I did not use a Bonferroni correction because we are only testing one variation. It might be useful to apply the Bonferroni correction if we decide to do post-test segmentation on the results, for example based on browser type or countries of origin.

###Recommendation
_Make a recommendation and briefly describe your reasoning._

The metrics I was interested in were **Gross conversion** and **Net conversion**.

Gross conversion turned out to be negative and practically significant. This is a good outcome because we lower our costs by discouraging trial signups that are unlikely to convert.
Net conversion unfortunately ended up being statistically and practically insignificant and the confidence interval includes negative numbers. Therefore, there is a risk that the introduction of the trial screener may lead to a decrease in revenue.

We should therefore consider test other designs of the screener before we decide whether to release the feature, or abandon the idea entirely.

##Follow-Up Experiment
_Give a high-level description of the follow up experiment you would run, what your hypothesis would be, what metrics you would want to measure, what your unit of diversion would be, and your reasoning for these choices._

From your favourite Genius handling your case in the Apple Store, to concierge services of AmEx Centurion—we love when one, real person is assigned to us in times of need, and especially when we pay a lot of money for a product of service of the company.

Udacity does a great job at offering a variety of ways for students to get help, be it through the discussion forum, office hours, or final project reviews. All of these however fail in two important aspects:

1. They require the student to make the first move. (As an aside, in case of the Discussion forum and Office hours, the user interface of the site makes it very challenging to find how to make that move, even if one is determined to seek help. Why is there no Discussion forum link in the navbar at the top of the site?)
2. They tend to expose the student to numerous people, with no one clear point of contact throughout the Nanodegree. (In the real world, this person would be either your Study advisor, or Faculty advisor, or assigned Senior in your Freshman year at college.)

Although we do not have the traffic to conduct a proper A/B experiment, when we implemented a more personal approach to customer support at LinguaLift, my language learning startup, the feedback has been overwhelmingly positive, as was the press we gathered, and eventual rise in revenues. Even users who barely made use of the service now had a clear feature to think of that differentiates us from the faceless, impersonal competition and justifies our higher price point.

Udacity could consider implementing a similar system for the Nanodegree program. When a user joins the trial program, he or she will receive an on-site message and a subsequent email from a randomly assigned member of the Udacity team. This message will introduce them to their concierge//guru/mentor or whatever the most appropriate wording would be for Udacity’s customer base (this could potentially be A/B tested as well, if the original experiment turns out to be a success), and encourage them to reach out to this team member whenever they need help.

Periodic check up emails should be set up, coming from the assigned team member’s email address. He or she should also be notified of new discussion forum posts made by the user in case they happen to have the expertise to answer the question.

###The Experiment
My **null hypothesis** is that assigning a single point of contact to new trial signups will not increase Retention by a practically significant amount.

New free trial signups will randomly be assigned to a Control and an Experiment group. The experience for users in the Control group will remain unchanged. Users in the Experiment group will be assigned a random member of the Udacity team and receive an on-site onboarding message and one email follow up from that person.

The **unit of diversion** will be the **user-id**, as this change only impacts what happens after a free trial account is created.

The **invariant metric** will be the **Number of user-ids**, because the users sign up for the free trial before they are assigned a point of contact and are exposed to the new onboarding messages.

The **evaluation metric** will be **Retention**, which, if positive and practically significant, will show an increase in revenue resulting from this change.

If Retention is positive and practically significant at the end of the experiment, we can launch the new feature, and expand it with more regular follow up emails and personalized on-site messages throughout the Nanodegree program.

##Resources
* [Nine Common A/B Testing Pitfalls and How to Avoid Them](http://adobe-target.com/content/dam/adobe/Common_AB_TestingPitfalls_2014.pdf)
