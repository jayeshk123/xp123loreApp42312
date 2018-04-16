//
//  eventsTableViewCell.swift
//  TestWV
//
//  Created by earth on 25/09/17.
//  Copyright © 2017 earth. All rights reserved.
//

import UIKit

class eventsTableViewCell: UITableViewCell {

    @IBOutlet weak var mainView: UIView!
    @IBOutlet weak var mainImage: UIImageView!
    @IBOutlet weak var titleLabel: UILabel!
    @IBOutlet weak var addressLabel: UILabel!
    @IBOutlet weak var dateLabel: UILabel!
    @IBOutlet weak var detailsLabel: UITextView!
    @IBOutlet weak var hideLayer: UIView!
    @IBOutlet weak var buyNowBtn: UIButton!
    override func awakeFromNib() {
        super.awakeFromNib()
        // Initialization code
        mainView.layer.cornerRadius = 10
        
    }

    override func setSelected(_ selected: Bool, animated: Bool) {
        super.setSelected(selected, animated: animated)

        // Configure the view for the selected state
    }
    
}
