<!--
  ~ Copyright (C) 2007-2020 Crafter Software Corporation. All Rights Reserved.
  ~
  ~ This program is free software: you can redistribute it and/or modify
  ~ it under the terms of the GNU General Public License version 3 as published by
  ~ the Free Software Foundation.
  ~
  ~ This program is distributed in the hope that it will be useful,
  ~ but WITHOUT ANY WARRANTY; without even the implied warranty of
  ~ MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  ~ GNU General Public License for more details.
  ~
  ~ You should have received a copy of the GNU General Public License
  ~ along with this program.  If not, see <http://www.gnu.org/licenses/>.
  -->

<html>
    <body>
    	<p>Hello!</p>
    	<p>
    		Forgot your password? To create a new one, click the link below or copy and paste it in your browser:
    		<br/>
    		<a href="${authoringUrl}/${serviceUrl}?token=${token?url}">${authoringUrl}/${serviceUrl}?token=${token?url}</a>
    	</p>
    	<p>
			Note: the above link expires, and can only be clicked once before being deactivated. If you did not successfully reset your password using the above link, you will need to request a new link.
		</p>

		<p>
		Thanks,

		Crafter Studio Admin.
		</p>

    </body>
</html>