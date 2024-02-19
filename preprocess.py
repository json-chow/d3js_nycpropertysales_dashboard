import pandas as pd
import random


df = pd.read_csv("nyc-rolling-sales.csv")

# Drop unneeded columns
df = df.drop(["Unnamed: 0", "ADDRESS", "APARTMENT NUMBER", "LOT", "EASE-MENT", "BUILDING CLASS CATEGORY"], axis=1)

# Make BUILDING CLASS AT PRESENT and BUILDING CLASS AT TIME OF SALE less granular
df["BUILDING CLASS AT PRESENT"] = df["BUILDING CLASS AT PRESENT"].replace({r"(\D)\d": r"\1"}, regex=True)
df["BUILDING CLASS AT TIME OF SALE"] = df["BUILDING CLASS AT TIME OF SALE"].replace({r"(\D)\d": r"\1"}, regex=True)

# Remove time from SALE DATE
df["SALE DATE"] = pd.to_datetime(df["SALE DATE"])

# Drop any NAs, viable because only need 500 data points
df = df[~df.isin([" -  "]).any(axis=1)]
df = df[df["YEAR BUILT"] != 0]
df = df[df["ZIP CODE"] != 0]

# Make SALE PRICE, LAND SQUARE FEET, GROSS SQUARE FEET type integer
df["SALE PRICE"] = df["SALE PRICE"].astype("int64")
df["LAND SQUARE FEET"] = df["LAND SQUARE FEET"].astype("int64")
df["GROSS SQUARE FEET"] = df["GROSS SQUARE FEET"].astype("int64")
df = df[df["SALE PRICE"] >= 500]
df = df[df["SALE PRICE"] <= 5000000]
df = df[df["LAND SQUARE FEET"] != 0]
df = df[df["LAND SQUARE FEET"] <= 10000]
df = df[df["GROSS SQUARE FEET"] != 0]
df = df[df["GROSS SQUARE FEET"] <= 10000]

# Randomly sample 500 data points
random.seed(123)
inds = random.sample(range(len(df)), k=500)
df = df.iloc[inds,]

print(df.describe())

df.to_csv("nyc-rolling-sales-preproc.csv", index=False)
