//
//  nativeEventsTableViewCell.swift
//  TestWV
//
//  Created by earth on 24/07/17.
//  Copyright © 2017 earth. All rights reserved.
//

import UIKit

class nativeEventsTableViewCell: UITableViewCell {

    @IBOutlet var eventImage: UIImageView!
    @IBOutlet var eventTitle: UILabel!
    @IBOutlet var eventLocation: UILabel!
    @IBOutlet var eventTime: UILabel!
    @IBOutlet var eventCost: UILabel!
    @IBOutlet var eventDesc: UILabel!
    
    override func awakeFromNib() {
        super.awakeFromNib()
        // Initialization code
    }

    override func setSelected(_ selected: Bool, animated: Bool) {
        super.setSelected(selected, animated: animated)

        // Configure the view for the selected state
    }
    
}
