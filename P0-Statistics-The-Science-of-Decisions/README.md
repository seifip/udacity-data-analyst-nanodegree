#Statistics: The Science of Decisions 
##Background information
In a Stroop task, participants are presented with a list of words, with each word displayed in a color of ink. The participant’s task is to say out loud the color of the ink in which the word is printed. The task has two conditions: a congruent words condition, and an incongruent words condition. In the congruent words condition, the words being displayed are color words whose names match the colors in which they are printed. In the incongruent words condition, the words displayed are color words whose names do not match the colors in which they are printed. In each case, we measure the time it takes to name the ink colors in equally-sized lists. Each participant will go through and record a time from each condition.

**Dataset:** [View CSV](https://drive.google.com/file/d/0B9Yf01UaIbUgQXpYb2NhZ29yX1U/view)

##Questions for investigation
As a general note, be sure to keep a record of any resources that you use or refer to in the creation of your project. You will need to report your sources as part of the project submission.

####1. What is our independent variable? What is our dependent variable?
**Dependent variable:** Time to name ink colours

**Independent variable:** Condition (congruent/incongruent)

####2. What is an appropriate set of hypotheses for this task? What kind of statistical test do you expect to perform?

**Hypothesis test**

**H<sub>0</sub>:** Time to name colours is the same for congruent and incongruent tasks

**H<sub>A</sub>:** Time to name colours is *not* the same for congruent and incongruent tasks

**Statistical test**

![Normal probability plot (Congruent)](pp-congruent.png) ![Normal probability plot (Incongruent)](pp-incongruent.png)

The data is roughly normally distributed, with a slight left tail. I will use a two-tailed dependent t-test because we are comparing two dependent samples of data.

####3. Report some descriptive statistics regarding this dataset.

**Congruent**

* **Mean:** 14.0
* **SD:** 3.6

**Incongruent**

* **Mean:** 22.0
* **SD:** 4.8

####4. Provide one or two visualizations that show the distribution of the sample data. Write one or two sentences noting what you observe about the plot or plots.

**Completion times of congruent and incongruent tasks**

![Completion times of congruent and incongruent tasks](completion-plot.png)

Congruent tasks appear to be consistently completed faster than incongruent tasks.

####5. What is your confidence level and your critical statistic value? Do you reject the null hypothesis or fail to reject it? Come to a conclusion in terms of the experiment task. Did the results match up with your expectations?

* **µD:** -7.9648
* **S:** 4.86482691
* **df:** 23
* **t-stat:** -8.020706944
* **at α 0.05, t-critical:** -2.06865761; 2.06865761
* **P:** 4.103E-08
* **95% CI:** (-25.3527231, 9.42314)

**Null hypothesis rejected.** At α 0.05, the *time to name colours is significantly
different* between congruent and incongruent tasks. People do not name colours
at the same speed when the word’s meaning and its colour match, as when they
do not match. The result confirms my expectations.



####6. Optional: What do you think is responsible for the effects observed? Can you think of an alternative or similar task that would result in a similar effect?

The brain has an image association between the shape of the word and the colour. When there is a mismatch, additional time is necessary for the prefrontal cortex to process the information and decide on its meaning.

A similar effect would likely be observed if the participants were shown words of the correct colour but the wrong text. My hunch, however, is that the difference would be less pronounced as I’d expect the visual colour representation to be more ingrained in the brain that word shape associations.
