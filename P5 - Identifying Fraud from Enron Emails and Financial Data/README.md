#Project 5: Identifying Fraud from Enron Emails and Financial Data
In 2000, Enron was one of the largest companies in the United States. By 2002, it had collapsed into bankruptcy due to widespread corporate fraud. In the resulting Federal investigation, a significant amount of typically confidential information entered into the public record, including tens of thousands of emails and detailed financial data for top executives.

In this project, I use machine learning to identify persons of interest based on financial and email data made public as a result of the Enron scandal, as well as a labeled list of individuals who were indicted, reached a settlement or plea deal with the government, or testified in exchange for prosecution immunity.

##1. Goals and dataset
The goal of this project is to build a predictive model that can identify persons of interest based on features included in the Enron dataset. Such model could be used to find additional suspects who were not indicted during the original investigation, or to find persons of interest during fraud investigations at other businesses. 

The dataset contains a total of **146 data points** with **21 features**. Of the 146 records, **18 are labeled as persons of interest**.

After visualizing the dataset as a scatter plot, I identified an outlier named `TOTAL`. This is a spreadsheet artifact and it was thus removed. 

##2. Feature selection
I started with a list of features that I intuitively felt are relevant to the investigation: `shared_receipt_with_poi`, `expenses`, `loan_advances`, `long_term_incentive`, `other`, `restricted_stock`, `restricted_stock_deferred`.

Additionally, I created three aggregate features:

* `fraction_from_poi`: Fraction of emails received from POIs.
* `fraction_to_poi`: Fraction of emails sent to POIs.
* `wealth`: Salary, total stock value, exercised stock options and bonuses.

I then filtered down this list to 5 features using the `scikit-learn` `SelectKBest` module:

**Feature** | **Score**
----------- | ---------
exercised_stock_options | 25.10
total_stock_value | 24.47
bonus | 21.06
salary | 18.58
fraction_to_poi | 16.64

Finally, I scaled all features using the `scikit-learn` `MinMaxScaler` to avoid problems caused by different units in the dataset. The algorithm chosen in the end however did not require feature scaling.

##3. Algorithm selection
I tested four different algorithms, performing a `scikit-learn` `GridSearchCV` parameter optimization on each of them:

###GaussianNB:
```
Precision: 0.388484126984
Recall: 0.282984126984
```

###DecisionTree:
```
Precision: 0.165993506494
Recall: 0.215702380952

Best parameters:
criterion='entropy', 
max_depth=None, 
max_leaf_nodes=None, 
min_samples_leaf=10, 
min_samples_split=2
```

###AdaBoost:
```
Precision: 0.414
Recall: 0.206305555556

Best parameters:
algorithm='SAMME', 
learning_rate=1.2, 
n_estimators=10
```

In the end, I selected GaussianNB as the best performer because it exhibited better recall than the alternatives, at the expense of precision, which is arguably more important for our purposes (identified POIs can be manually double-checked later on, so there is no major risk from false positives).

##3. Algorithm tuning
Tuning a machine learning algorithm is crucial because different functions and initial settings can have a profound effect on its performance. In some cases, such as selecting a wrong minimum number of samples per leaf in a Decision Tree algorithm, the algorithm can overfit. In other cases, such as selecting the wrong number of clusters for a KMeans algorithm, the end result can be entirely wrong and unuseable.

I performed automatic parameter tuning using `scikit-learn` `GridSearchCV` during the algorithm selection process.

##4. Validation
Validation allows us to assess how well the chosen algorithm generalizes beyond the dataset used to train it—that is, identify the risk of overfitting.

One of the biggest mistakes one can make is therefore to use the same data fro training and testing.

To cross validate my chosen algorithm, I ran 100 randomized trials and assessed mean evaluation metrics. Given the imbalance in the dataset betweet POIs and non-POIs, **accuracy** would not have been an appropriate evaluation metric. I therefore used **precision** and **recall** instead:

```
Mean precision: 0.39
Mean recall: 0.28
```

The selected algorith, Gaussian Naïve Bayes, showed a better recall (i.e. the proportion of individuals identified as POIs, who actually are POIs) compared to other algorithms, at a slight expense of precision (i.e. proportion of POIs who have successfully been identified).

This could be a problem if false positives presented real risks, such as in the medical field, but in case of the Enron investigation false negatives are arguably more detrimental, given that individuals identified as POIs will not be convicted based on the results of the analysis alone, but rather undergo further inquiry.

Cross validation using the provided `StratifiedShuffleSplit` method then returned even better evaluation metrics:

```
Mean precision: 0.46
Mean recall: 0.30
```