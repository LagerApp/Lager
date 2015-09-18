require 'rubygems'

def parse_time(data)
	mysql_time_format = "[0-9]{2}:[0-9]{2}:[0-9]{2}"
	clf_time_format = "[0-9]+\/[a-zA-Z]{3}\/[0-9]{4}:[0-9]{2}:[0-9]{2}:[0-9]{2}"
	apache_time_format = "[a-zA-Z]{3} [a-zA-Z]{3} [0-9]+ [0-9]{2}:[0-9]{2}:[0-9]{2} [0-9]{4}"

	if /#{clf_time_format}/ =~ data
		str = data.match(/#{clf_time_format}/).to_s
		time = DateTime.strptime( str, "%d/%b/%Y:%H:%M:%S")	
	elsif /#{apache_time_format}/ =~ data
		str = data.match(/#{apache_time_format}/).to_s
		time = DateTime.strptime( str, "%b %d %H:%M:%S %Y")		
	elsif /#{mysql_time_format}/ =~ data
		str = data.match(/#{mysql_time_format}/).to_s
		time = DateTime.strptime( str, "%H:%M:%S")						
	else 
		time = nil		
	end

	return time
end
