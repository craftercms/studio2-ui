CStudioForms.Controls.RTE.ChannelSelect = CStudioForms.Controls.RTE.ChannelSelect || {
    createControl: function(n, cm, editor) {
        switch (n) {
            case 'channel':
				var config = tinymce2.activeEditor.contextControl.fieldConfig;
	            var channels = null;
	            
				for(var i=0; i<config.properties.length; i++) {
					var prop = config.properties[i];
					
					if(prop.name == "supportedChannels") {
						if(prop.value && prop.Value != "") {
							channels = eval(prop.value);
						}
					}
				}

				if(channels) {

                   if(channels.length && channels.length > 0) {
	                	var mlb = cm.createListBox('channelSelect', {
	                    	 title : 'Channel',
	                     	 onselect : function(v) {
	                     	 	var channelConfig = v.split(":");
	                     	 	
		                        tinymce2.activeEditor.contextControl._applyChannelStyleSheets(channelConfig[0]);
		                         
		                        var editorEl = document.getElementById(tinymce2.activeEditor.id+'_ifr');
		                        var editorContainerEl = document.getElementById(tinymce2.activeEditor.id+'_tbl');
								editorEl.style.width = channelConfig[1] + "px";	 
								editorContainerEl.style.width = channelConfig[1] + "px";                     
	                     	}
	                	});
	
	 					var defaultWidth = tinymce2.activeEditor.contextControl.inputEl._width; 	
						mlb.add("Default", "default:"+defaultWidth);
						
						for(var i=0; i<channels.length; i++) {
		            		mlb.add(channels[i].key, channels[i].value+":"+channels[i].size);
		            	};

                		return mlb;
					}
					else {
						// default channel is all that is supported, dont render
					}
				}
				else {
					// default channel is all that is supported, dont render
				}
        }

        return null;
    }
}

tinymce2.create('tinymce2.plugins.CStudioChannelSelectPlugin', CStudioForms.Controls.RTE.ChannelSelect);

// Register plugin with a short name
tinymce2.PluginManager.add('channel', tinymce2.plugins.CStudioChannelSelectPlugin);

CStudioAuthoring.Module.moduleLoaded("cstudio-forms-controls-rte-channel", CStudioForms.Controls.RTE.ChannelSelect);