//
//  showListTableViewCell.swift
//  TestWV
//
//  Created by earth on 31/07/17.
//  Copyright © 2017 earth. All rights reserved.
//

import UIKit

class showListTableViewCell: UITableViewCell {

    @IBOutlet var downArrowImage: UIImageView!
    @IBOutlet var categoryTitle: UILabel!
    
    override func awakeFromNib() {
        super.awakeFromNib()
        // Initialization code
    }

    override func setSelected(_ selected: Bool, animated: Bool) {
        super.setSelected(selected, animated: animated)

        // Configure the view for the selected state
    }
    
}
