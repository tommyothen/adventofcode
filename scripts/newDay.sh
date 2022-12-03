# Get the lang from ./scripts/config.ini
year=$(date +%Y)
lang=$(awk -F "=" '/\[langs\]/{a=1}a==1&&$1~/'$year'/{print $2;exit}' ./scripts/config.ini)

# Copy the template to the new day (day1, day2, etc.)
day=$(date +%-d)
cp ./templates/$lang/ ./years/$year/day$day -r


echo "Created new day $day for $year in $lang"
