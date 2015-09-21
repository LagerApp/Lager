require 'rubygems'

def parse_time(data)
	mysql_time_format = "[0-9]{2}:[0-9]{2}:[0-9]{2}"
	clf_time_format = "[0-9]+\/[a-zA-Z]{3}\/[0-9]{4}:[0-9]{2}:[0-9]{2}:[0-9]{2} [+-][0-9]{4}"
	apache_time_format = "[a-zA-Z]{3} [a-zA-Z]{3} [0-9]+ [0-9]{2}:[0-9]{2}:[0-9]{2} [0-9]{4}"

	if /#{clf_time_format}/ =~ data
		str = data.match(/#{clf_time_format}/).to_s
		time = DateTime.strptime( str, "%d/%b/%Y:%H:%M:%S %z")	
		data[/\[#{str}\]/] = ''
	elsif /#{apache_time_format}/ =~ data
		str = data.match(/#{apache_time_format}/).to_s
		time = DateTime.strptime( str, "%a %b %d %H:%M:%S %Y")		
		data[/\[#{str}\]/] = ''
	elsif /#{mysql_time_format}/ =~ data
		str = data.match(/#{mysql_time_format}/).to_s
		time = DateTime.strptime( str, "%H:%M:%S")						
		data[/#{str}/] = ''
	else 
		time = nil		
	end

	parsed_data = {"data" => data, "timestamp" => time}
	return parsed_data
end
