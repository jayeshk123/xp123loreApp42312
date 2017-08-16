//
//  ShowListSubSectionsTableViewCell.swift
//  TestWV
//
//  Created by earth on 01/08/17.
//  Copyright © 2017 earth. All rights reserved.
//

import UIKit

class ShowListSubSectionsTableViewCell: UITableViewCell {

    @IBOutlet var leftImage: UIImageView!
    @IBOutlet var rightImage: UIImageView!
    @IBOutlet var titleLabel: UILabel!
    @IBOutlet var locationLabel: UILabel!
    @IBOutlet var distanceLabel: UILabel!
    @IBOutlet var statusLabel: UILabel!
    
    override func awakeFromNib() {
        super.awakeFromNib()
        // Initialization code
    }

    override func setSelected(_ selected: Bool, animated: Bool) {
        super.setSelected(selected, animated: animated)

        // Configure the view for the selected state
    }
    
}
