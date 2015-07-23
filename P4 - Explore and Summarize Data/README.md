#Project 3: Exploring and Summarizing Hillary 2016 Contribution Data
In this project, I conduct exploratory data analysis on the 2016 presidential campaign contribution data of Hillary Rodham Clinton, from April 1st to July 1st 2015. My goal is to find new insights in the dataset and identify avenues for further investigation.

![Hillary Clinton 2016](hillary-clinton-2016-president-election.jpg)

**Dataset:** [CSV from fec.gov](http://fec.gov/disclosurep/PDownload.do)

**Format:** [Data Dictionary at fec.gov](ftp://ftp.fec.gov/FEC/Presidential_Map/2016/DATA_DICTIONARIES/CONTRIBUTOR_FORMAT.txt)

##Detailed analysis

[EDA of Hillary 2016 Contributions](https://cdn.rawgit.com/seifip/udacity-data-analyst-nanodegree/master/P4%20-%20Explore%20and%20Summarize%20Data/hillary_2015-contribs.html)

*Also see Knittr `hillary_2015-contribs.Rmd` in the repository.*

##Final plots and summary

Exploratory Data Analysis of the Hillary Rodham Clinton 2016 campaign from April to July 2016 identified several avenues for further investigation.

###1. Contributions by occupation (nationwide)

![Contributions by occupation (nationwide)](contribs_occup.png)

The average contributions to the campaign differ substantially across occupations.

The retired, unemployed, professors and physicians all have very low median contributions, with some outliers in the $2000-2700 range.

CEOs, homemakers and presidents have a median equal to the contribution limit. Attorneys, lawyers, and consultants do not make high median contributions but there is very significant variance. This is likely because some of these contributors are employed by major law and consulting firms who may even endorse and cover their contributions, whereas others are part of a smaller partnership and cover the contribution out of pocket.

The variance may also be indicative of the U-shaped [distribution of salaries in the legal professions](http://qph.is.quoracdn.net/main-qimg-0a0d8f37efe16a83e4f1208aea3b1988?convert_to_webp=true).

###2. Contributions by employer (nationwide)

![Contributions by employer (nationwide)](contribs_employer.png)

This chart makes it especially clear where a lot of the money flows from. The largest donor is Morgan & Morgan, a consumer protection and personal injury law firm. Most of the other donors are also legal firms, with the exception of one talent agency, one financial institution and one Ivy League university.

Given that some of the top donors in the 2012 Obama campaign (Source: https://www.opensecrets.org/pres12/) were major universities, I would have expected to see more purple in the list. I'm also surprised to see Morgan Stanley, one of the top donors in the 2012 Mitt Romney campaign (ibid.). Of course, it is impossible to say whether Morgan Stanley doesn't have an equal, or even larger stake in campaigns of GOP candidates without analysis of the entire dataset.

###3. Contributions by state

![Contributions by state](contribs_state.png)

The choropleth map of total amount of contributions by state is largely unsurprising, with one exception.

Why is Texas, a predominantly Republican state, one of the top sources of contributions for Hillary Clinton?

I tried to investigate this question by exploring contributions by employer using a Texas subset of the data, but discovered no easy explanation.

Generating a more granualar choropleth of contributions from Texas, using the ZIP code information showed that most contributions come from a few select areas of the state. This is not surprising, but any further conclusions require a better knowledge of the demographics of Texas than I possess, and ideally data on political affiliations of the individual regions.

###4. Contribution time series

![Contribution time series](contribs_time.png)

Plotting contributions from April 12th, when Hillary Clinton announced her candidacy, till July 1stm, faceted by origin states' political affiliations gives us yet another perspective on the data. 

Contributions appear to be remarkably consistent. A an increase in small contributions (< $250) can be observed in the last few months. This could be seasonal, or a natural evolution as the electoral cycle progresses.

Although the median contributions are consistently higher from Democrat states, the difference isn’t very large. Of note are the last two weeks of May, when median Republican and swing state contributions were higher than those from Democrat states.

##Reflection
The Hillary 2016 campaign contributions dataset contains over 38,000 entrie from April till July 2015. Although the elections are still far away, analysis of existing data can give us some indication of most important contribution sources, and allows us to predict the demographics Hillary Clinton should approach as her fundraising progresses.

I started by understanding the individual variables by studying the [official dataset format](ftp://ftp.fec.gov/FEC/Presidential_Map/2016/DATA_DICTIONARIES/CONTRIBUTOR_FORMAT.txt), then conducting basic descriptive statistical analysis.

To begin with, I chose to omitt all entries above the [$2700 contribution limit](http://www.fec.gov/pages/fecrecord/2015/february/contriblimits20152016.shtml) as they break the [Federal Election Campaign Act](http://www.fec.gov/law/feca/feca.pdf) and thus were or will be refunded.

I then used these findings and my domain expertise to explore contribution numbers and amounts across a number of variables including occupation, employer, and state.

Some findings where not surprising:

* Contributions to Hillary's campaign tend to come from California and the city of New York
* Contributions tend to be made by the retired
* Law firms are some of the major employers behind the contributors
* More women are contributing to the campaign, but their median contributions are lower (The dataset does not include gender information. Instead, I predicted contributors' gender from their first name, based on the Social Security Administration data)

Other findings were more surprising, however:

* Physicians, who are [among the best paid in the country](http://www.bls.gov/oes/current/oes_nat.htm),  make very small contributions compared to other occupations.
* Texas, a [predominantly Republican state](https://en.wikipedia.org/wiki/Politics_of_Texas), is among the top 10 sources of contributions to Hillary Clinton's campaign.
* The self-employed are clearly, by far, the largest contributors to Hillary Clinton's campaign. This is surprising, given that Republicans are roughly 50% more likely to be self-employed (Fried, pp. 104–5, 125.). Of course, without analysis of all contributions in this electoral cycle, it is impossible to tell whether an even larger number of self-employed Americans contribute to GOP candidates.

It would be most interesting to explore this dataset further by combining it with data from Hillary Clinton's 2008 presidential campaign. Have Hillary's contribution sources changed since 8 years ago? Could we predict current and future contributors using data from previous elections? These are all important questions that could be studied using a combined dataset.
