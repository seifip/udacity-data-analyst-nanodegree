library(ggplot2)
library(scales)
library(reshape2)
library(dplyr)

df <- read.csv("participation.csv")
dfm <- melt(df)
dfm <- mutate(dfm, variable = substring(variable, 2), value = value/100)
p <- ggplot(dfm, aes(factor(variable), value, group = Language, label = Language))
p1 <- p + geom_line(colour="lightskyblue", size=1) +
          geom_line(data=subset(dfm, Language == "Chinese"), colour="firebrick", size=1.5) +
          geom_text(data = subset(dfm,
                                                variable == "2005"),
                                  aes(x = 1), size = 3.5, hjust = 1) +
          geom_text(data=filter(dfm, Language == "Chinese",
                                     variable == "2005"),
                    aes(x = 1), size = 3.5, hjust = 1, color="firebrick") +
          ggtitle(expression(atop("Top Languages of the Internet", atop(italic("Internet users % of world total"), ""))))
  p1 <- p1 + theme_bw() + theme(legend.position = "none", panel.border = element_blank()) +
    scale_x_discrete() + scale_y_continuous(labels=percent) +
                                                      xlab(NULL) + ylab(NULL)
p1